var mongoose=require('mongoose');

LostandFound=mongoose.model('LostandFound');

exports.getAllLostItems=function(req,res) {
    LostandFound.find({lost:true},function(err, lostitems) {
        if (err) return console.error(err);
        res.json({message:lostitems});
    });
}

exports.getAllFoundItems=function(req,res){

    LostandFound.find({found:true},function(err, founditems) {
        if (err) return console.error(err);
        res.json({message:founditems});
    });
}

exports.postDelete = function(req, res){
    console.log("id is: "+req.body.item);
    LostandFound.findOne({_id: req.body.item}).remove(function(err){
        if(err){
            console.log(err);
            res.send({success: false});
        }
        else {
            res.send({success: true});
        }
    });
}