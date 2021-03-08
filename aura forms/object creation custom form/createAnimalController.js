({
	save : function(component, event, helper) {

        var name = component.get('v.createAnimal.Name');
        if(name == undefined || name == null || name == '') {
         	helper.showToast('Ooops !', 'Please fill up name', 'error');
        }
        else {
        	var action = component.get('c.saveAnimal');
        	action.setParams({
            	animal : component.get('v.createAnimal')
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