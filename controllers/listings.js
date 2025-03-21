const Listing=require("../Models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner"); console.log(listing);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

module.exports.createListing=async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url+".."+filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","new listing is created!");
    res.redirect("/listings");
}

module.exports.rendereditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", {listing,originalImageUrl});
  };

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
      throw new expressError(400,"Send valid data for listing");
    }
    const listing=req.body.listing;
    // let listing=await Listing.findById(id);
    let updateListing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      updateListing.image={url,filename};
      await updateListing.save();
    }
    req.flash("success","listing is updated");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listings");
  };
