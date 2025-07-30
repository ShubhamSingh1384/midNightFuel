import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        totalAmount:0,
    },
    reducers: {
        uploadCartItems: (state, action) => {
            state.cartItems = action.payload; // Overwrite the cartItems with new data
          },
        addCartItmes(state, action) {
            const existingProduct = state.cartItems.find(item => item.id === action.payload);
            console.log(action.payload);
            
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.cartItems.push({ id:action.payload, quantity: 1 });
            }
            console.log(state.cartItems);
        
        },
        removeCartItmes(state, action) {
            const product = state.cartItems.find(item => item.id === action.payload);
            if (product) {
                state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
                state.cartTotal -= product.price * product.quantity;
            }
        },
        updateCartItmes(state, action) {
            const { id, quantity } = action.payload;
            console.log(id,quantity);
            const product = state.cartItems.find(item => item.id === id);
            
            if (product) {
                product.quantity = quantity;
            }
            
        },
        updateTotalAmount(state,action){
            state.totalAmount = action.payload;
        }
        
    },
});

export const { addCartItmes, removeCartItmes, updateCartItmes,uploadCartItems,updateTotalAmount } = cartSlice.actions;
export default cartSlice.reducer;
