const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "My {{params.subject}}";
sendSmtpEmail.htmlContent =
  "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
sendSmtpEmail.sender = {
  name: "Deepak Aklecha",
  email: "deepakaklecha2020@gmail.com",
};
sendSmtpEmail.to = [{ email: "deepakaklecha238@gmail.com", name: "Deepu" }];
// sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
// sendSmtpEmail.bcc = [{ email: "example@example.com", name: "John Doe" }];
sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { parameter: "My param value", subject: "New Subject" };

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);
