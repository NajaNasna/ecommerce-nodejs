var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var {ObjectId}  =require('mongodb')
const { response } = require('../app')



module.exports ={

    doSignup:  (userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
       const result=   db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                console.log(data)
                resolve(data)
            })
        })

    },

    doLogin : (userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            loginStatus = false
            let response = {}
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{   
                    if(status){
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },



    addToCart : (prodId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:new ObjectId(userId)},
                {
                    $push:{products:new ObjectId(prodId)}
                }).then((response)=>{
                    resolve()
                })
            }else{
                let cartObj = {
                    user:new ObjectId(userId),
                    products:[new ObjectId(prodId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },

    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:new ObjectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },


    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
    }
}


