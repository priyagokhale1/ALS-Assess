# Import flask module
from flask import Flask, render_template, url_for, request, jsonify
from datetime import datetime
import pyrebase

# Flask constructor takes name of current module
# (__name__) as argument
app = Flask(__name__)

config = {}

# route() function of Flask class is a decorator,
# that tells app which URL should call the associated
# function.

@app.route("/")                         # index page
def index():                     
    return render_template("index.html")

@app.route("/aboutUs")                 # about us page
def aboutUs():                     
    return render_template("aboutUs.html")

@app.route("/ourProduct")                 # our product page
def ourProduct():                     
    return render_template("ourProduct.html")

@app.route("/timeline")                 # timeline page
def timeline():                     
    return render_template("timeline.html")

@app.route("/dashboard")                     # home page       
def dashboard():                     
    return render_template("dashboard.html")



@app.route("/test", methods=['GET', 'POST', 'SET'])
def test():
    timeStampDate = datetime.now().strftime("%d-%m-%Y")

    global config, userID, db, timeStamp, key
    # POST request (FB configuration sent from login.js)
    if request.method == 'POST':

        # Each data set will be stored under its own child node identified by a timestamp
        # Get time stamp to be used as firebase node
        

        # Receive Firebase config credentials, pop uid and assign to userID
        config = request.get_json() # parse as JSON
        userID = config.pop('userID') # userID used for updating data in FRD

        # Output to a console (or file) is normally buffered (stored) until it is
        # forced out by the printing of a newline. Flush will force the information
        # in the buffer to be printed immediately

        print('User ID: ' + userID, flush = True)   # Debug only
        print(config, flush = True)                 # Debug only

        # Initilize firebase connection
        firebase = pyrebase.initialize_app(config)

        # Create database object ("db" represents the root node in the database)
        db = firebase.database()


        # Write sample data to FB to test connection
        # db.child('users/' + userID + '/data/' + '/' + timeStamp).update({'testKey':'testValue'})

        return 'Success', 200
    else: 
        #Code to get data from Arduino will go here
        if(bool(config) == False):
            print("FB config is empty")
    

        else:

            key = datetime.now().strftime("%H:%M:%S")
            # Take parameters from Arduino request & assign value to variable "value"

            # print(config)
            value = request.args.get('sensorValue')

            print('sensorValue: ' + value, flush = True)

            # Write arduino data to Firebase
            db.child('users/' + userID + '/data/' + '/' + timeStampDate).update({key:value})


        return 'Success'

# main driver function
if __name__ == "__main__":

    # Run app through port 5000 on local dev. sever
    # app.run(debug = True, host="172.20.10.2", port=5000)
    app.run(debug = True)


