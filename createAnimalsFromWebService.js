import { LightningElement } from 'lwc';
import getAnimalInfoListByIdRange from '@salesforce/apex/Animal.getAnimalInfoListByIdRange';
import createAnimals from '@salesforce/apex/Animal.createAnimals';

const columns = [
    { label: 'ID', fieldName: 'ExternalID__c' },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Says', fieldName: 'Says__c' },
    { label: 'Eats', fieldName: 'Eats__c' }
];

export default class CreateAnimalsFromWebService extends LightningElement {

    minExtId = 1;
    maxExtId = 5;
    columns = columns;
    animalList = [];

    getAnimalBtnClickHandler() {
        getAnimalInfoListByIdRange({ minExtId : this.minExtId,
                                    maxExtId : this.maxExtId
        }).then(result => {
            if(result) {
                console.log(result);
                this.animalList = result;
            }
            else if(error) {
                let errorMessage = "Error: " + error;
                alert(errorMessage);
                console.log(errorMessage);
            }
        });   
    }

    createAnimalsBtnClickHandler() {
        console.log(this.template.querySelector('lightning-datatable').getSelectedRows());
        createAnimals({arrayOfAnimals : this.template.querySelector('lightning-datatable').getSelectedRows()})
    }

}