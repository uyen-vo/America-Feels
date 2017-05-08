America Feels
========================

The purpose of this application is to visually display how America feels about a topic based on the Tweets people post. This will be done through a visual of the United States, each state displaying a color corresponding to the amount negative/positive Tweets it has, and a search bar to allow for users to search for a specific topic.

The web services we used are the d3.js to dynamically display the data for our map, the Twitter Stream API to pull information on people's opinions live, and the Microsoft Cognitive API to analyze the tweet for a certain emotion and be able to color define it. A live demo of our site is available: <a href = "http://lowcost-env.ab7a25j9zc.us-east-1.elasticbeanstalk.com/" target="_blank">here</a>. 

We have also provided instructions on how to deploy the applciation on AWS Elastic Beanstalk.

<h2>Step 1: Create AWS Account</h2>
Since we will be hosting our web application on Amazon Web Services, you first need an account:
<ol>
	<li>Visit <a href="http://aws.amazon.com/">http://aws.amazon.com</a>.</li>
	<li>Click the Sign Up button at the top.</li>
	<li>Complete the registration process.</li>
</ol>

<h2>Step 2: Create an AWS Elastic Beanstalk application</h2>
Access Elastic Beanstalk from the console. Choose to create a new application and give it a name and description.

<h2>Step 3: Create an Environment</h2>
An application can have multiple environments; for our application, we used a low cost environment and it can be named however is preferred along with using the following settings:
<ul>
  <li>Environment tier: Web Server</li>
  <li>Predefined configuration: Node.js</li>
  <li>Environment Type: Single Instance</li>
</ul>

<h2>Step 4: Upload AWS Application</h2>
You will be asked to choose the soruce of the application. Choose to upload your own by uploading a zip file containing the following files, which can also be found in this repository:
<ul>
  <li>package.json</li>
  <li>public folder</li>
  <li>server.js</li>
</ul>

You will finally be taken to a dashboard where you need to wait for the application launch. Make sure that heatlh is shown to be "Green". 

<h2>Step 5: Node.js Configuration</h2>
Once launched, Node.js starts two processes: the web server to handle the static pages and the web socket server. On Elastic Beanstalk, all of the traffic goes through Nginx, which acts as a proxy server. Considering we are only using web sockets it is easier to turn all proxies off and direct connect.

While on your environment dashboard, click <em>Configuration</em> from the left menu. Then on the <em>Software Configuration</em> tile click the Cog icon. Set the <em>Proxy server</em> drop-down to <b>none</b> and click Save.

You can now access the web page by clicking the link next to the title on the environment dashboard.

