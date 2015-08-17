var totalCost = 0; 
 var combinedMessage = '';

//doubletap capture--very sensitive, triggers on drag-drop, map to same function as PC below
$(document).ready(function() {
  $('.dragImg').addSwipeEvents(function(evt, touch) {
    if (touch.eventType = "doubletap"){
	alert( "capture and show the item price, title and description here");
	}
  });
 
 //delete all
  $("#trash").click(function(){
	$(".dragged2").remove();
	RemoveAllItems();
	Write2Bill();
  });

  
  //$(".dragImg").click(function(){
	//alert('hi');
	//thisWidth= $(".dragImg").width();
	//thisWidth= $(this)[0].attr('width');
		 //oldHeight= $("#frame .dragImg").height();  //necessary bc didn't set an attribute --need for firefox
		// alert( thisWidth);
		 //$(".dragImg").css("width", (thisWidth*2.5));
		 //$("#frame .dragImg").css("width", (oldWidth*2.5));
 // });
  
});  //end-document ready

$(function(){  
    $("#dialog").dialog({
    	autoOpen: false,
    	buttons: {
    		"Close": function(){
    			$(this).dialog("close")
    		}
    	}
    }); });

$(function(){  
 //Make every clone image unique.  
   var counts = [0];
    var resizeOpts = { 
      handles: "all" ,autoHide:true
    }; 
	
   $(".dragImg").draggable({
                         helper: "clone",
                         //Create counter
                         start: function() { counts[0]++; },
                        stop: handleDragStop   //catch trigger of a drop (only the first one)
                        });

$("#frame").droppable({
       drop: function(e, ui){

	   
	   
	   
               if(ui.draggable.hasClass("dragImg")) {
     				$(this).append($(ui.helper).clone());
					
					if(!(ui.draggable.hasClass("furniture"))) {  //if not furniture, then add to bill
						AddItem($("#frame .dragImg").attr('title'),$("#frame .dragImg").attr('sku'),$("#frame .dragImg").attr('price'),$("#frame .dragImg").attr('description'),$("#frame .dragImg").attr('src'),$("#frame .dragImg").attr('varID'));
						Write2Bill();
					} //end if has class furniture
					
   //Pointing to the dragImg class in frame and add new class so that can identify for later actions.
         $("#frame .dragImg").addClass("item-"+counts[0]);  //for identifying the specific piece clicked to delete it
         $("#frame .dragImg").addClass("dragged2"); //added tag to be called by delete-all
		 
		 //resize the cloned image--would like to do this as soon as the drag begins instead of on drop.
		 oldWidth= $("#frame .dragImg").attr('width');
		 oldHeight= $("#frame .dragImg").height();  //necessary bc didn't set an attribute --need for firefox
		 $("#frame .dragImg").css("height", (oldHeight*2.5));
		 $("#frame .dragImg").css("width", (oldWidth*2.5));
		 
		
//Remove the current class (ui-draggable and dragImg)
         $("#frame .item-"+counts[0]).removeClass("dragImg ui-draggable ui-draggable-dragging");


//double click the clone to delete
$(".item-"+counts[0]).dblclick(function() {
itemToDelete = $(this).attr('title'); //get handle on what to remove from the array
RemoveItem(itemToDelete); //run the array delete on the double-clicked pic's title
$(this).remove(); //remove the double-clicked pic
Write2Bill();
});    

make_draggable($(".item-"+counts[0]));
      $(".imgSize-"+counts[0]).resizable(resizeOpts);     
       }  //end if (has class dragImg)
	   
	   
       }  //end drop function
      });  //end droppable


var zIndex = 0;
function make_draggable(elements)
{	
	elements.draggable({
		containment:'parent',
		start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
		stop:function(e,ui){
		}
	});	
}     
   });

function Write2Bill(){	
    var billStringPrefix = "<table class='invoice'>";
	billString =""; //necessary before the additive loops	
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
        billString = billString + "<tr><td rowspan='2'>" + "<img class='thumb' src='" + arrangements[i].image +"'"+ " alt='image of '"+ arrangements[i].item + ">" + "</td><td>" + arrangements[i].item + "</td><td>" + arrangements[i].sku + "</td><td>" + arrangements[i].price + "</td></tr><tr><td colspan='3'>" + arrangements[i].description + "</td></tr>"
    }; //end for
    totalString =GetTotal();
    totalString = "<tr><td class='totalRow' colspan='5'>" + "Total: <span class='totalText'>" + totalString + "</span></td></tr>";
	billString = billStringPrefix + billString + "</table>";
	document.getElementById("checkout").innerHTML = billString;
	document.getElementById("checkoutHeader").innerHTML = "Your Order " + totalString;
} //end func WriteBill

function AddItem(id, sku, price, description, image, variantID) {
    var numItems = arrangements.length;
	
    arrangements[numItems] = {item:id, sku:sku, price:price, description:description, image:image, variantID:variantID};
 //alert (arrangements[numItems].variantID );
    //reporter();
}//end func AddItem

function RemoveItem(id) {
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
        if (arrangements[i].item === id) {   //if you find this id remove the item
            arrangements.splice(i,1);
			//NEED CODE THAT IF ARRAY IS EMPTY RE-ADD PLACEHOLDER TEXT
            break;
        } //end if
    } //end for
    //reporter();
} //end func RemoveItem

function RemoveAllItems() {
    arrangements = [];       //wipe the array of items
	$(".dragged2").remove(); //remove all images on the frame (have class "dragged2")
} //end func RemoveAllItems

//USE THIS FOR STAGING PRESET COLLECTIONS --//First drop, record addition of item and record the drop xy location
function handleDragStop( event, ui ) {
  var offsetXPos = parseInt( ui.offset.left );
  var offsetYPos = parseInt( ui.offset.top );
  //alert( "Drag stopped!\n\nOffset: (" + offsetXPos + ", " + offsetYPos + ")\n");
  
};

var arrangements = [];

function reporter() {
    alert ("array items " +arrangements.length);
}//end func Reporter

function GetTotal(){
    //**********ERROR WONT RETURN PROMPT IF STILL ZERO
    var Total = 0;
    var curCost = 0;
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
            curCost = Number(arrangements[i].price);
            //alert (curCost);
            Total = Total + curCost;
			Total =  Math.round(Total * 100) / 100;  //round to 2 decimal.
    }; //end for
    return Total;
//alert ("Total Cost: " + Total);
} //end func GetTotal

function ToggleCasket(){
var el = document.getElementById("frame");  //capture the frame object for later use
var elImage = el.style.backgroundImage;   //read background image path
var withoutLastChunk = elImage.slice(0, elImage.lastIndexOf('/'));  //capture the path (whole prefix) to the image
var lastChunk =elImage.slice(elImage.lastIndexOf('/')+1, elImage.length); //capture the filename string
lastChunk = lastChunk.substring(0, lastChunk.length - 1); //clean the filename string
lastChunk = lastChunk.replace(/"/g, ''); //addl. normalizing for firefox
withoutLastChunk = withoutLastChunk.replace(/"/g, ''); //addl. normalizing for firefox

if(lastChunk == 'casket-med.jpg') { // if open casket, load closed casket image
	tempx = withoutLastChunk + '/' + 'casket-closed-med.jpg)';
	el.style.backgroundImage = withoutLastChunk + '/' + 'casket-closed-med.jpg)';
}
else if (lastChunk == 'casket-closed-med.jpg'){
 el.style.backgroundImage = "url('img/urn-layout.jpg')";
}
else {
 el.style.backgroundImage = "url('img/casket-med.jpg')";
}
}	

function PushToCart(){
	var cart = [];
    for (var i = 0; i < arrangements.length; i++) {   //loop through all items
			cart.push(arrangements[i].variantID);            
			//alert (cart[0]);		
    }; //end for
	
var f = document.createElement('form'); 
f.style.display = 'none'; 
f.id ='myform';
f.action = "http://memorialhelpers.com/cart/add";  
f.method = 'POST'; 
 
 //need error catching if no items submitted (if-then)

 var allIds = {};
 
 for(i=0;i<cart.length;i++){   //loop through each variantId
	allIds["landmark" + i] = document.createElement('input');
	allIds["landmark" + i].setAttribute('type', 'hidden'); 
	allIds["landmark" + i].setAttribute('name', 'id[]'); 
	allIds["landmark" + i].setAttribute('value', cart[i]); 
	f.appendChild(allIds["landmark" + i]); 
  }
f.submit(); 
return false;
} //end func PushToCart