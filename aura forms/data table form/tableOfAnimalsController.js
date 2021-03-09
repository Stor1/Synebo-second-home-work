({
   init: function (cmp, event, helper) {
        cmp.set('v.columns', [
            { label: 'Animal Name', fieldName: 'Name', type: 'text'},
            { label: 'Food', fieldName: 'Eats__c', type: 'text'},
            { label: 'Language', fieldName: 'Says__c', type: 'text'},
            { label: 'External ID', fieldName: 'ExternalID__c', type: 'text'}
        ]);
        helper.getData(cmp);
    },
    
    loadMoreData: function (cmp, event, helper) {
        helper.fetchData(cmp, event);
    },
    
    createAnimal: function (cmp, event, helper) {
        var recordEvent=$A.get("e.force:createRecord");
        recordEvent.setParams({
            "entityApiName": "Animal__c"
        });
        recordEvent.fire();
    }
})