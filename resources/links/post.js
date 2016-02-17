if(this.links.length > 3){
    
    error('message', "You can't have more than 3 links")
}
for (var i = this.links.length - 1; i >= 0; i--) {
    if(this.links[i].indexOf("bund.li") > -1){
       
       error('message', "You can't bundle a bund.li link") 
       
    }
}