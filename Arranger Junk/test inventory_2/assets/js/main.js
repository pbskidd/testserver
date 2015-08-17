/**
 * Created by Dad on 06/05/2015.
 */
var arrangements = [];

function reporter() {
    alert ("array items " +arrangements.length);
}//end func Reporter

function AddItem(id, sku, price, description, image) {
    var numItems = arrangements.length;
    //arrangements[numItems] = {item:"Meadows of Memories", sku:"TF-66666", price:"89.99", description:"bla bla", image:"http://cdn.shopify.com/s/files/1/0790/8529/products/T271-1A_1024x1024.jpeg?v=1425992835",};
    arrangements[numItems] = {item:id, sku:sku, price:price, description:description, image:image};
    reporter();
}//end func AddItem

function RemoveItem(id) {
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
        
        if (arrangements[i].item === id) {   //if you find this id remove the item
		alert("item " + arrangements.length + " is " + arrangements[i].item);
        //alert('clipping');
            arrangements.splice(i,1);
			return false;
            //break;
        } //end if
    } //end for
    //reporter();
} //end func RemoveItem

function GetTotal(){
    //**********ERROR WONT RETURN PROMPT IF STILL ZERO
    var Total = 0;
    var curCost = 0;
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
            curCost = Number(arrangements[i].price);
            alert (curCost);
            Total = Total + curCost;
    }; //end for
    return Total;
alert ("Total Cost: " + Total);
} //end func GetTotal

function WriteBill(){
    billString = "<table>";
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
        billString = billString + "<tr><td>" + "<img src=" + arrangements[i].image +"alt='image of '"+ arrangements[i].item + ">" + "</td><td>" + arrangements[i].item + "</td><td>" + arrangements[i].sku + "</td><td>" + arrangements[i].price + "</td><td>" + arrangements[i].description + "</td></tr>"
    }; //end for

    totalString =GetTotal();
    //alert(totalString);
    totalString = "<tr><td colspan='5'>" + "Total: " + totalString + "</td></tr>";

        billString = billString + totalString + "</table>";
    document.getElementById("checkout").innerHTML = billString;
} //end func WriteBill