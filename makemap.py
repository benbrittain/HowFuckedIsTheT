import json

map = dict()

def makeStation(sn=None):
    station = dict()
    if sn == None:
        station['name'] = input("Station Name:")
    else:
        station['name'] = sn

    station['x'] = input("x:")
    station['y'] = input("y:")

    ns = input("next stations:")
    station['next_stations'] = list()
    while ns != "":
        print("Child station of " + station['name'])
        station['next_stations'].append(makeStation(ns))
        ns = input("next stations (enter if done with " + station['name'] +")")
    return station

def main():
    map = dict()
    map['root'] = makeStation()
    print(json.dumps(map))
    fout = open('map.json', 'w')
    fout.write(json.dumps(map, sort_keys=True, indent=4))
    fout.close()

main();
