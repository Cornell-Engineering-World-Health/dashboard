from pymongo import MongoClient
from subprocess import call
import math

#parameters
database = "ewh"
collection = "readings"
pathToRawData = "public/data/exportData/"
pathToData = "public/data/"
offset = 1000

#open client/setup database stuffs
client = MongoClient()
db = client[database]
coll = db[collection]

# def writeRawDataByOffset():
#     totalDocs = coll.find().count()
#     docList = coll.find()
#     rounds = math.ceil(float(totalDocs)/offset)
#     for r in range(rounds):
#         start = r*offset
#         if (r+1)*offset >= totalDocs:
#             end = totalDocs
#         else:
#             end = (r+1)*offset
#         f = open(pathToRawData+"data"+start+"_"+end,'w')
#         f.write('[')
#         for doc in docList[start:end]:
#             f.write(doc)
#             f.write(',')
#         f.write(']')
#         f.close()

def writeRawDataByOffset():
    global coll
    global pathToRawData
    global pathToData
    global offset
    totalDocs = coll.find().count()
    rounds = int(math.ceil(float(totalDocs)/offset))
    #remove old data
    call(["rm","-r",pathToRawData])
    call(["mkdir",pathToRawData])
    #writing json file with up to offset number of objects per file
    for r in range(rounds):
        start = r*offset
        if (r+1)*offset >= totalDocs:
            end = totalDocs
        else:
            end = (r+1)*offset
        call(["mongoexport","--db",database,"--collection",collection,
            "--skip",str(start),"--limit",str(offset),"--jsonArray", "--out",pathToRawData+"data"+str(start)+"_"+str(end)+".json"])
    call(["zip","-rj",pathToData+"data.zip",pathToRawData])

writeRawDataByOffset()