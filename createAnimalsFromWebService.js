import { LightningElement, track } from 'lwc';
import getAnimalInfoListByIdRange from '@salesforce/apex/Animal.getAnimalInfoListByIdRange';
import createAnimals from '@salesforce/apex/Animal.createAnimals';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'ID', fieldName: 'ExternalID__c' },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Says', fieldName: 'Says__c' },
    { label: 'Eats', fieldName: 'Eats__c' }
];

function showToast (title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
        mode: 'dismissable'
    });
    dispatchEvent(evt);
}

export default class CreateAnimalsFromWebService extends LightningElement {

    minExtId = 1;
    maxExtId = 5;
    columns = columns;
    animalList = [];
    @track isExtIdDisabled = false;
    @track isBtnGetAnimalDisabled = false;
    @track isBtnCreateAnimalsDisabled = true;

    handleMinExtId(event) {
        this.minExtId = event.detail.value;
        let errorMessage = '';

        if(this.maxExtId < this.minExtId || this.minExtId > this.maxExtId) {
            errorMessage = errorMessage + '\n\'External ID max\' can\'t be less than \'External ID min\'';
        }
    
        if(this.minExtId == '' || this.minExtId == null || this.minExtId == undefined) {
            errorMessage = errorMessage + '\nYou should fill \'External ID min\' field';
        }
    
        if(this.maxExtId == '' || this.maxExtId == null || this.maxExtId == undefined) {
            errorMessage = errorMessage + '\nYou should fill \'External ID max\' field';
        }

        if(errorMessage == '') {
            this.isBtnGetAnimalDisabled = false;
        } else {
            this.isBtnGetAnimalDisabled = true;
            showToast('Error !', errorMessage, 'error');
        }
    }

    handleMaxExtId(event) {
        this.maxExtId = event.detail.value;
        let errorMessage = '';

        if(this.maxExtId < this.minExtId || this.minExtId > this.maxExtId) {
            errorMessage = errorMessage + '\n\'External ID max\' can\'t be less than \'External ID min\'';
        }
    
        if(this.minExtId == '' || this.minExtId == null || this.minExtId == undefined) {
            errorMessage = errorMessage + '\nYou should fill \'External ID min\' field';
        }
    
        if(this.maxExtId == '' || this.maxExtId == null || this.maxExtId == undefined) {
            errorMessage = errorMessage + '\nYou should fill \'External ID max\' field';
        }

        if(errorMessage == '') {
            this.isBtnGetAnimalDisabled = false;
        } else {
            this.isBtnGetAnimalDisabled = true;
            showToast('Error !', errorMessage, 'error');
        }
    }

    getAnimalBtnClickHandler() {

        this.isBtnGetAnimalDisabled = true;
        this.isExtIdDisabled = true;

        getAnimalInfoListByIdRange({ minExtId : this.minExtId,
                                    maxExtId : this.maxExtId
        }).then(result => {
            if(result) {
                this.animalList = result;
                this.isBtnCreateAnimalsDisabled = false;
                showToast('Success !', 'Animals Retrieved Successfully', 'success');
            }
            else if(error) {
                this.isBtnCreateAnimalsDisabled = true;
                let errorMessage = "Error: " + error;
                showToast('Error !', errorMessage, 'error');
            }
        });

        this.isBtnGetAnimalDisabled = false;
        this.isExtIdDisabled = false;
    }

    createAnimalsBtnClickHandler() {
        let selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows();
        if (selectedRows.length == 0) {
            showToast('Warning', 'Select one or more rows to create animals', 'warning');
            return;
        }
        console.log(selectedRows.length);
        createAnimals({
            animals : selectedRows
        }).then(showToast('Success !', 'Animals Created Successfully', 'success'));
    }

}