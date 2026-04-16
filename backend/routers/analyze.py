from fastapi import APIRouter
from ml.model import AnomalyDetector


def parse_log(line: str):
    parts = line.split()
    
    return{
        "timestamp": parts[0],
        "source_ip": parts[1],
        "port": int(parts[2]),   
        "protocol": parts[3],
        "bytes": int(parts[4])
    }


router = APIRouter()
detector = AnomalyDetector()


#for below, the features implemented are: request frequency, payload size, port num, protocol, time of day

@router.post("/analyze")
def analyze(logs: list[str]):
    all_features = []
    all_parsed = []
    for i in range(len(logs)):
        parsed = parse_log(logs[i])
        hour = int(parsed["timestamp"].split("T")[1].split(":")[0])
        
        protocol_int = -1
        if parsed["protocol"] == "TCP":
            protocol_int = 0
        elif parsed["protocol"] == "UDP":
            protocol_int = 1
        elif parsed["protocol"] == "ICMP":
            protocol_int = 2
            
        freq = 0
        for line in logs:
            if parsed["source_ip"] in line:
                freq += 1
            
        features = [freq, parsed["port"], parsed["bytes"], protocol_int, hour]
        all_features.append(features)
        all_parsed.append(parsed)
        
        
    anomaly_indices = []
    for i in range(len(all_features)):
        score = detector.model.score_samples([all_features[i]])[0]
        if score < -0.1:
            anomaly_indices.append(i)
            
    anomalies = []
    for index in anomaly_indices:
        anomalies.append(all_parsed[index])
        
        
    return {"anomalies": anomalies}


        
        
        
        
        
        
        
       
