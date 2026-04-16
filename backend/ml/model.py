import numpy as np
import joblib
import os
from sklearn.ensemble import IsolationForest


#throughout the code you gonna see self everywhere
#self — when you write a class, self refers to the specific instance of that class.
#from claude:
#When you do detector = AnomalyDetector() and then detector.train(), inside train, self IS detector. It's how methods access the object's own data.
#Without self.model you'd just have a local variable model that disappears when the method finishes. With self.model it belongs to the object and every method can access it.

class AnomalyDetector:
    def __init__(self):
        #contamination means how much of the data you expect to have anomalies, random state is the seed number for rando number generator
        #Isolation Forest uses randomness when building trees — setting a seed means you get the same trees every time you run it. Makes results reproducible and debuggable
        #Also we dont have labeled data so we should use something that requires none - so stuff ive learnt about wouldnt work like xgboost, naive bayes and so on 
        #while there may be better options for accuracy, which i can revisit later - according to my research - this is good for large datasets and is fast
        #further, from youtube video - isolation forest is a inds anomalies through outliers using an ensable of decision trees by recusively splitting the dataset by selected features and values
        self.model = IsolationForest(contamination=0.1, random_state=42)
        
        #save results here
        self.model_path = "ml/model.joblib"
        
        if os.path.exists(self.model_path):
            self.load()
        else:
            self.train()
        
        
        
    def train(self):
        #random.normal is used to draw random samples form a normal gaussian distribution
        #again, we can revisit to make more accurate and fine tune
        #further - later down the line maybe we can deduce is this is for a company or home - probably the latter, cause the amount of activity for a network is egregous 
        #loc is the mean - 0.5 means thats where regular traffic should sit
        #scale = standard dev
        #size = shape of the array - 1000 samples and 5 features (eg source ip, dest ip, port, protocol, packet size and so on)
        X = np.random.normal(loc=0.5, scale=0.1, size=(1000, 5))
        self.model.fit(X)
        self.save()
        
        #when researching this shit, i thought  youd use the function model.predict
        #but according to claude: Why no self.model.predict — you're right to question it. predict() returns -1 or 1 but doesn't tell you how anomalous something is. score_samples() gives you the actual score so you can set your own threshold.
        
        #scores returns the anamoly score and the array only holds values with a score less than -0.1
        #-0.1 is tunable - the lower the stricter - which we might make in the near future - for example to 0.2 cause at the end of the day, this is a security product and needs to be strict 
    def predict(self, data):
        scores = self.model.score_samples(data)
        return [row for row, score in zip(data, scores) if score < -0.1]
    
    
    #joblib.dump = write to disk. joblib.load = read from disk
    def save(self):
        joblib.dump(self.model, self.model_path)
        
    
    def load(self):
        self.model = joblib.load(self.model_path)
        
