const sgMail = require('@sendgrid/mail');

export default async function(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { email, comments, firstName, cookies, jobType, pets } = req.body;

  const petNames = pets.map(pet => `${pet.type}: ${pet.name}`);

  //const petNames = pets.map(pet => <li key={pet.id}>{pet.name}</li>);

  const content = {
    to: 'b.ingenthron@coobomedia.com',
    from: email,
    subject: `New Message From - ${email}`,
    text: comments,
    html: `
    <p>Hi, ${firstName}.</p>
    <p>${comments}</p>
    <p>${cookies}</p>
    <p>${jobType}</p>
    <p>${petNames}</p> 
    `
  };

  try {
    console.log('Content', content);
    res.status(200).send('Message sent successfully.');
  } catch (error) {
    console.log('ERROR', error);
    res.status(400).send('Message not sent.');
  }
}
