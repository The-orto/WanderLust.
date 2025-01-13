const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding ({accessToken : mapToken});

module.exports.index = async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.newListing = async (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req ,res,)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
            strictPopulate: true,
        },})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }   
        
        res.render("./listings/show.ejs" , {listing});
    };

    module.exports.postListing = async (req ,res ,next)=>{
        let respose = await geocodingClient.forwardGeocode({
            query:req.body.listing.location,
            limit:1,
        })

        .send ();

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = respose.body.features[0].geometry;

        let savedlisting = await newListing.save();
        req.flash( "success", " New Listing created!");
        res.redirect("/listings");
    };

    module.exports.editListing = async (req ,res,next) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exist!")
            res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/c_crop,h_300,w_250");
        res.render("./listings/edit.ejs", { listing , originalImageUrl});
    };

    module.exports.updateListing = async( req, res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if (typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash( "success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing = async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
       req.flash( "success", "Listing deleted!");
       res.redirect("/listings")
    };

    
    // module.exports.searchListings = async (req, res) => {
    //     const query = (req.query.search || '').toLowerCase(); // Ensure 'search' is the query parameter
    //     console.log(query);
    
    //     try {
    //         const listing1 = await Listing.find({
    //             $or: [
    //                 { title: { $regex: query, $options: 'i' } },
    //                 { description: { $regex: query, $options: 'i' } }
    //             ]
    //         });
    //         console.log({ allListings: listing1 });
    
    //         res.render("./listings/home.ejs", { allListings: listing1 });
    //     } catch (error) {
    //         console.error("Error fetching listings:", error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // };
    

    // module.exports.index = async (req, res) => {
    //     const allListings = await Listing.find({});
    //     res.render("./listings/home.ejs", { allListings });
    // };
    
    
        
    // const newListing = new Listing(req.body.listing);
    // newListing.owner = req.user._id;
    // await newListing.save();
    // req.flash("success","New Listing Created!");