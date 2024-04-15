const Item = require('../Schema/items'); // Make sure the path to your schema is correct
const nodemailer = require('nodemailer');
const add = async (req, res) => {
    try {
        const itemCategory = req.body.itemCategory;
        const itemName = req.body.itemName;
        const itemCost = req.body.itemCost;
        const itemImage = req.files['itemImage'][0]; // Get the image file
        const categoryImage = req.files['categoryImage'][0]; // Get the image file

        if (!itemImage) {
            throw new Error('itemImage is missing or undefined.');
        }

        if (!categoryImage) {
            throw new Error('categoryImage is missing or undefined.');
        }

        const item = await Item.create({
            itemCategory,
            itemName,
            itemCost,
            itemImage: itemImage.buffer, // Use the buffer property directly
            categoryImage: categoryImage.buffer // Use the buffer property directly
        });

        if (item) {
            console.log('Item created:', item);
            res.status(200).send({ msg: "done" });
        } else {
            console.log('Item creation failed');
            res.status(500).send({ msg: "error" });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ msg: "error" });
    }
};


const categories = async (req, res) => {
    try {
        const categories = await Item.aggregate([
            {
                $group: {
                    _id: '$itemCategory',
                    categoryImage: { $first: '$categoryImage' }, // Change to 'categoryImage' field
                },
            },
        ]);

        const categoriesWithBase64Images = categories.map(category => ({
            _id: category._id,
            categoryImage: category.categoryImage.toString('base64'),
        }));

        res.status(200).json({
            categories: categoriesWithBase64Images,
        });
    } catch (error) {
        res.status(500).json({
            msg: 'failed',
            error: error.message,
        });
    }
}

const getitem = async (req, res) => {
    try {
        const { itemCategory } = req.params; // Destructure itemCategory from params

        // Find items with the specified category name
        const items = await Item.find({ itemCategory: itemCategory });

        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No items found for the specified category' });
        }

        // Map items to extract relevant data and convert image buffer to base64 string
        const itemData = items.map(item => ({
            itemName: item.itemName,
            itemCost: item.itemCost,
            itemImage: item.itemImage.toString('base64') // Convert buffer to base64 string
        }));

        res.status(200).json(itemData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteitem = async (req, res) => {
    try {
        const itemName = req.params.itemName;
        console.log(itemName)
        const deletedItem = await Item.findOneAndDelete({ itemName: itemName });

        if (deletedItem) {
            console.log('Item deleted:', deletedItem);
            res.status(200).json({ msg: 'Item deleted successfully' });
        } else {
            console.log('Item not found');
            res.status(404).json({ msg: 'Item not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
const update = async (req, res) => {
    const productName = req.params.itemName;
    const itemCost = req.body.itemCost;
    console.log(productName, itemCost)

    try {
        const updatedProduct = await Item.findOneAndUpdate(
            { itemName: productName },
            { itemCost },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ msg: 'Item Price Updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'nammakadai.shop@gmail.com', 
      pass: 'lohtbzzbozymosdp', 
    },
  });


const senddetails =async (req, res) => {
    try {
      // Extract customer data and cart from the request

      const { name, phone, email, address, deliveryTime, cart } = req.body;
  
      // Send an email to the shopkeeper with order details
      const shopkeeperEmail = 'nammakadai.shop@gmail.com'; // Replace with the shopkeeper's email
      const shopkeeperMailOptions = {
        from: 'nammakadai.shop@gmail.com',
        to: shopkeeperEmail,
        subject: 'New Order Placed',
        html: `
          <p>Customer Information:</p>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Address: ${address}</p>
          <p>Delivery Time: ${deliveryTime}</p>
          
          <p>Order Details:</p>
          <ul>
            ${cart.map(item => `<li>${item.itemName} - Quantity: ${item.quantity}</li>`).join('')}
          </ul>
        `,
      };
  
      await transporter.sendMail(shopkeeperMailOptions);
  
      // Send an email to the customer with order details
      const customerMailOptions = {
        from: 'nammakadai.shop@gmail.com',
        to: email,
        subject: 'Order Confirmation',
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for placing your order with us. Your order details are as follows:</p>
          
          <p>Order Details:</p>
          <ul>
            ${cart.map(item => `<li>${item.itemName} - Quantity: ${item.quantity}</li> - price: ${item.quantity*item.itemCost}`).join('')}
          </ul>
          
          <p>Your order will be delivered to:</p>
          <p>Address: ${address}</p>
          <p>Delivery Time: ${deliveryTime}</p>
          
          <p>We appreciate your business!</p>
        `,
      };
  
      await transporter.sendMail(customerMailOptions);
  
      res.status(200).json({ message: 'Order placed successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'An error occurred while processing your order.' });
    }
  }

    module.exports = {
        add,
        categories,
        getitem,
        deleteitem, update, senddetails
    };
