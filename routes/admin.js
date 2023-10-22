var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


  let products=[
    {
      name:"Vivo",
      category:"Mobile",
      description:"This is a mobile",
      image:"https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1666000526/Croma%20Assets/CMS/CAtegory/Mobile%20phone%20-%20C10/NEW%20PCP%20DESIGN%20-%20OCT/Updated/MPCP_shopbybrand_vivo_27sep2022_bxrwva.png?tr=w-1000"
    },
    {
      name:"iPhone",
      category:"Mobile",
      description:"This is a mobile",
      image:"https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/apple-iphone12-mini-mobiles.jpg"
    },{
      name:"OnePlus",
      category:"Mobile",
      description:"This is a mobile",
      image:"https://www.reliancedigital.in/medias/One-Plus-10R-Mobile-Phone-492850198-i-4-1200Wx1200H?context=bWFzdGVyfGltYWdlc3w3MzAxOXxpbWFnZS9qcGVnfGltYWdlcy9oYWYvaDlmLzk4NzM5NzQwNjcyMzAuanBnfGRhOWY5NzJiY2MxMWNkNzcwNmNjNGMzYTZiZDNlZDVkNzk0MGJiNjY3ZGIyYWFkMDEzNGM5MjQ0NjI0NzRkY2Y"
    },{
      name:"Nokia",
      category:"Mobile",
      description:"This is a mobile",
      image:"https://5.imimg.com/data5/BK/SP/MY-40083844/nokia-5130-xpressmusic-mltimedia-mobile-phones-500x500.jpg"
    },
  ]


  res.render('admin/view-products',{admin:true,products});
});


router.get('/add-product',function(req,res){
    res.render('admin/add-product')
})


router.post('/add-product', (req,res)=>{
  console.log(req.body)
  console.log(req.files.image)



})

module.exports = router;
