# Development Info

All of the code for the project is current in the `survey-app` folder. This project is built using [KeystoneJS](https://keystonejs.com/). More specifically it uses [Node.js](https://nodejs.org/en/), [MongoDB](https://www.mongodb.com/what-is-mongodb), [Express](https://expressjs.com/), [Pug](https://pugjs.org/api/getting-started.html), [Stylus](http://stylus-lang.com/) and [Bootstrap](https://getbootstrap.com/).

## Dependencies
* Node.js / npm
  * https://nodejs.org/en/download/
* MongoDB
  * Mac: `brew install mongodb`
  * [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

## Set up
* Clone the repository   

  ```
  git clone https://github.com/will-saunders/BCAT.git
  cd BCAT/survey-app
  npm install
  ```
* Create a `.env` file with a cookie secret:   

  ```
  touch .env
  echo "COOKIE_SECRET=<a_bunch_of_characters>" > .env
  ```
  For now, `<a_bunch_of_characters>` can be whatever you'd like.  

* Start mongodb: `mongod`
* In a separate terminal run `npm start` or  `node keystone`
* Check `localhost:3000`
* Debugging work out of the box with VSCode

## Structure
```
BCAT/survey-app
|-- models
|-- public
    |-- styles
        |-- site
            |-- _layout.styl
            |-- _variables.styl
|-- routes
    |-- index.js
    |-- middleware.js
    |-- views
|-- templates
    |-- views
```
* models
  * this is where MongoDB models are defined, using [keystone field types](https://keystonejs.netlify.com/api/field/)
* public/styles/site
  * `_layout.styl` and `_variables.styl` are the stylus files to override bootstrap defaults.
  * `site.css` and `site.styl` are generated, so any changes you make to them will be overwritten
* routes
  * this is the folder for express routing
  * new routes are added to `routes/index.js`
  * code for handling each new route should go under `routes/views/<your_view>.js`
* templates
  * this is the folder for pug templates
  * code for new pages go under `templates/views/<your_view>.pug`

## Resources
[Keystone Demo](http://demo.keystonejs.com/)  
[Keystone Demo Repo](https://github.com/keystonejs/keystone-demo)  
[Keystone DB Documentation](https://keystonejs.netlify.com/documentation/database/)  
[Throttling Network w/Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/network-conditions)
