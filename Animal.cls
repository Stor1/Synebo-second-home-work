public class Animal {
    
    public AnimalInfo animal;
	public String[] animals;
    
    public class AnimalInfo {
        
        public String eats;
    	public String says;
    	public String id;
    	public String name;
        
        public AnimalInfo(String id, String name, String says, String eats) {
            this.id = id;
            this.name = name;
            this.says = says;
            this.eats = eats;
        }
        
        public Boolean equals(Object obj) {
        if (obj instanceof AnimalInfo) {
            AnimalInfo an = (AnimalInfo)obj;
            return ((eats==an.eats)&&(says==an.says)&&(id==an.id)&&(name==an.name));
        }
        return false;
    }
        
    }
    
    public Boolean equals(Object obj) {
        if (obj instanceof Animal) {
            Animal p = (Animal)obj;
            AnimalInfo animalInfo = p.animal;
            return ((animals==p.animals)&&(animal.eats==animalInfo.eats)&&(animal.says==animalInfo.says)&&(animal.id==animalInfo.id)&&(animal.name==animalInfo.name));
        }
        return false;
    }
    
    @future(callout=true)
    public static void updateAnimalsFieldsFromWebService(Set<Id> animalsIds) {
    	
        List<Animal__c> animals = [SELECT Name, Eats__c, Says__c, ExternalID__c FROM Animal__c WHERE Id IN :animalsIds AND ExternalID__c != null];
        List<Animal__c> animalsForUpdate = new List<Animal__c>();
        
        AnimalInfo animalInfo;
        Boolean changesWereMade;
        
        for (Animal__c animalObj : animals) {
            
        	animalInfo = getAnimalInfoById((Integer) animalObj.ExternalID__c);
            changesWereMade = fillAnimalObjectFieldsFromAnimalInfo(animalObj, animalInfo);
            
            if (changesWereMade) {
               animalsForUpdate.add(animalObj); 
            }
            
        }
        
        if (animalsForUpdate.size() > 0) {
            Database.update(animalsForUpdate);
        }
        
    }
    
     public static AnimalInfo getAnimalInfoById(Integer animalId) {
        
        Http http = new Http();
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals/' + animalId);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);
        
        AnimalInfo animalInfo;
        if (response.getStatusCode() == 200) {
            Animal webAnimal = (Animal) JSON.deserialize(response.getBody(), Animal.class);
            animalInfo = webAnimal.animal;
        }
        return animalInfo;
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Animal__c> getAnimalInfoListByIdRange(String minExtId, String maxExtId){
        
        Integer minExtIdInt = Integer.valueOf(minExtId);
        Integer maxExtIdInt = Integer.valueOf(maxExtId);

        List<Animal__c> animalInfoList = new List<Animal__c>();

        for (Integer exId = minExtIdInt; exId < maxExtIdInt+1; exId++) {
            AnimalInfo af = getAnimalInfoById(exId);
            if (af != null && af.id != '0') {
                Animal__c animal = new Animal__c(Name = af.name, ExternalID__c = (Decimal) exId);
                fillAnimalObjectFieldsFromAnimalInfo(animal, af);
                animalInfoList.add(animal);
            }
        }

        return animalInfoList;
    }

    @AuraEnabled
    public static void createAnimals(List<Animal__c> animals){
        System.debug(animals);
        insert animals;
        EmailManager.sendEmailAboutCreatedAnimals(animals, 'Created_animals');
    }
    
    public static Boolean fillAnimalObjectFieldsFromAnimalInfo(Animal__c animalObj, AnimalInfo animalInfo) {
        
        Boolean changesWereMade = false;
        
        if (animalInfo == null) {
            return changesWereMade;
        }
        
    	if (animalObj.Eats__c == null && animalInfo.eats != null && String.isNotBlank(animalInfo.eats) && String.isNotEmpty(animalInfo.eats)) {
            animalObj.Eats__c = animalInfo.eats;
            changesWereMade = true;
        }
            
        if (animalObj.Says__c == null && animalInfo.says != null && String.isNotBlank(animalInfo.says) && String.isNotEmpty(animalInfo.says)) {
            animalObj.Says__c = animalInfo.says;
            changesWereMade = true;
        }
        
        return changesWereMade;
        
    }
    
    public static void createAnimalObjectByExternalId(Integer animalExtId) {
    	
    	AnimalInfo animalInfo = getAnimalInfoById(animalExtId);
        if (animalInfo != null || animalInfo.id != '0') {
            
            String nameForNewAnimal = 'new Animal';
            
            if (animalInfo.name != null || String.isBlank(animalInfo.name) || String.isEmpty(animalInfo.name)) {
                nameForNewAnimal = animalInfo.name;
            }
            Animal__c newAnimal = new Animal__c(Name = nameForNewAnimal, ExternalID__c = animalExtId);
            if (fillAnimalObjectFieldsFromAnimalInfo(newAnimal, animalInfo)) {
                insert newAnimal;
            }
        }
        
    }
    
}