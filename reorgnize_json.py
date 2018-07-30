# -*- coding: utf-8 -*-

import json
from pprint import pprint

with open('./data/raw_weekends_rainy') as f:
    data = json.load(f)

#pprint(len(data['map']))
#print(data['map'])

d = {}
d["n_line"] = data["map"]["n_lines"]
d["n_stops"] = data["map"]["n_stops"]
d["names"] = data["map"]["names"]
d["coordinates"] = data["map"]["coordinates"]

#print(d)
#print(len(d))
d["index_up"], d["index_down"] = [], []
d["time_up"], d["time_down"] = [], []
for i in range(6,23):
	d["index_up"].append(data["map"]["index_up_"+str(i)])
	d["index_down"].append(data["map"]["index_down_"+str(i)])
	d["time_up"].append(data["map"]["time_up_"+str(i)])
	d["time_down"].append(data["map"]["time_down_"+str(i)])

#print(len(d))
#print(len(d["time_down"]))

outer_d = {"map":[d]}
#print(outer_d)


length = 0
res = []
for i,line in enumerate(d["names"]):
	for j,name in enumerate(line):
		if len(name) > length:
			length = len(name)
			res = [(name,i,j)]
		elif len(name) == length:
			res.append(name)
print(res)
print(length, len(res))


#print(json.dumps(outer_d))