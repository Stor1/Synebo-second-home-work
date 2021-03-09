({
    getData : function(cmp) {
        var action = cmp.get('c.getAnimals');
        action.setParams({
            limitSize : cmp.get('v.initialRows')
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.data', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    
    fetchData : function(cmp, event) {
        var data = cmp.get("v.data");
        var lastId = data[cmp.get("v.data").length - 1].Id;
        
        event.getSource().set("v.isLoading", true);
        cmp.set('v.loadMoreStatus', 'Loading');
        
        var action = cmp.get('c.getAnimals');
        action.setParams({
            limitSize : cmp.get('v.rowsToLoad'),
            lastRecordId : lastId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                if (cmp.get('v.data').length >= cmp.get('v.totalNumberOfRows')) {
                    cmp.set('v.enableInfiniteLoading', false);
                    cmp.set('v.loadMoreStatus', 'No more data to load');
                } else {
                    var currentData = cmp.get('v.data');
                    var newData = currentData.concat(response.getReturnValue());
                    cmp.set('v.data', newData);
                    cmp.set('v.loadMoreStatus', '');
                }
                event.getSource().set("v.isLoading", false);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})