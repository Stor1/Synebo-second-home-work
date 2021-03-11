({
	save : function(component, event, helper) {

        var name = component.get('v.name');
        var eats = component.get('v.eats');
        var says = component.get('v.says');
        var extId = component.get('v.extId');
        if(name == undefined || name == null || name == '') {
         	helper.showToast('Ooops !', 'Please fill up name', 'error');
        }
        else {
        	var action = component.get('c.saveAnimal');
        	action.setParams({
            	name : name,
                eats : eats,
                says : says,
                extId : extId
                
        	});
        	action.setCallback(this,function(response){
                var state = response.getState();
         		if(state === "SUCCESS") {
  					helper.showToast('Success !', 'Record Inserted Successfully', 'success');
         		}
        	});
        	$A.enqueueAction(action);
      	}	
	}
})