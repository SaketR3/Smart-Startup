<h1 align="center">Smart Start-Up</h1>



<h4 align="center">Concept</h4>
When it comes to start-ups, there can be a lot of difficulties involved. Chief among these difficulties is finding funding until the business is self-sustaining. That's where this project comes in. I built a custom neural network trained on over 315,000 prior SBA loan interactions that predicts whether a start-up will qualify for the loan they're looking for based on information such as industry, location type, etc. 
<br />
<br />
Once I made the neural network, I built a web app so that start-ups can simply input their information and see how likely they are to qualify for the loan they're looking for. Additionally, the web app uses retrieval augmented generation (RAG) to feed the start-up's data and information about SBA loans to the ChatGPT API, which returns personalized advice to the start-up on how it can increase its chances of qualifying for the loan. 
<br />
<br />
Finally, I programmed an authentication system so that start-ups can create an account to save their results! 

<br />
<br />



<h4 align="center">Tech Stack</h4>
<ul>
    <li>Pandas for data pre-processing</li>
    <li>TensorFlow for model creation and training</li>
    <li>Flask for serving the model</li>
    <li>React & useSWR (in TypeScript) for the web app front-end</li>
    <li>Express (in JavaScript) for the main web app server</li>
    <li>PostgreSQL (using the Sequelize ORM) for the database</li>
    <li>LangChain for RAG & ChatGPT</li>
<ul>

<br />



<h4 align="center">More Details</h4>
<div align="center">
<p><strong>Prediction Creation Page:</strong></p>
Here, start-ups can enter their information.

<br />
<br />

![Form with questions asking for start-up information](/readme-images/prediction-creation-page.png)

<br />

<p><strong>Prediction Results Page:</strong></p> 
Start-ups see the model's prediction as well as advice created with retrieval augmented generation (RAG). Start-ups can also click 'Save Data' to save new predictions to their account. 

<br />
<br />

![Box with model prediction, which is a percentage, and advice from ChatGPT](/readme-images/prediction-results.png)

<br />

<p><strong>Account Dashboard</strong></p> 
Here, start-ups can see their latest information, model prediction, and advice. 

<br />
<br />

![Box with start-up's information such as location and loan type](/readme-images/account-dashboard-page-1.png)

![Box with more of start-up's information such as model prediction and advice](/readme-images/account-dashboard-page-2.png)

<br />

<p><strong>Account Creation and Log-In Pages</strong></p> 

![Account creation page asking for username, password, and name](/readme-images/account-creation-page.png)

![Log-in page asking for username and password](/readme-images/login-page.png)

</div>


