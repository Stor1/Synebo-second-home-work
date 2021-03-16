public class EmailManager {

    // Public method
    public static void sendMail(String address, String subject, String body) {
        // Create an email message object
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {address};
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        // Pass this email message to the built-in sendEmail method 
        // of the Messaging class
        Messaging.SendEmailResult[] results = Messaging.sendEmail(
                                 new Messaging.SingleEmailMessage[] { mail });
        
        // Call a helper method to inspect the returned results
        inspectResults(results);
    }

    public static void sendEmailAboutCreatedAnimals(List<Animal__c> createdAnimals, String templateDevName) {

        EmailTemplate emailTemplate = [Select Id, Subject, Body from EmailTemplate where DeveloperName =: templateDevName];

        String animalsSize = String.valueOf(createdAnimals.size());

        String subject = emailTemplate.Subject;
        subject = subject.replace('{!animals.size}', animalsSize);

        String animalsLinks = '';
        String constPart = 'https://wise-narwhal-hjlhr0-dev-ed.lightning.force.com/lightning/r/Animal__c/';
        for (Animal__c animal : createdAnimals) {
            animalsLinks = animalsLinks + (!String.isBlank(animalsLinks)? '\n' : '') + constPart + animal.Id + '/view';
        }

        System.debug('sendEmailAboutCreatedAnimals : animalsLinks ' + animalsLinks);

        String plainBody = emailTemplate.Body;
        plainBody = plainBody.replace('{!Today}', String.valueOf(Datetime.now()));
        plainBody = plainBody.replace('{!FirstName}', UserInfo.getUserName());
        plainBody = plainBody.replace('{!animals.size}', animalsSize);
        plainBody = plainBody.replace('{!animalsLinks}', animalsLinks);

        Messaging.Singleemailmessage email = new Messaging.Singleemailmessage();

        email.setToAddresses(new String[] {UserInfo.getUserEmail()});

        email.setSubject(subject);
        email.setPlainTextBody(plainBody);

        Messaging.sendEmail(new Messaging.SingleEmailmessage[] {email});

    }
    
    // Helper method
    private static Boolean inspectResults(Messaging.SendEmailResult[] results) {
        Boolean sendResult = true;
        
        // sendEmail returns an array of result objects.
        // Iterate through the list to inspect results. 
        // In this class, the methods send only one email, 
        // so we should have only one result.
        for (Messaging.SendEmailResult res : results) {
            if (res.isSuccess()) {
                System.debug('Email sent successfully');
            }
            else {
                sendResult = false;
                System.debug('The following errors occurred: ' + res.getErrors());                 
            }
        }
        
        return sendResult;
    }
    
}