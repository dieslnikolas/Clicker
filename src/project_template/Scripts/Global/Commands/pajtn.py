# file sits in C:\Users\diesl\Developing\src\Dieslnikolas\Clicker\src\project_template\Scripts\Global\Commands\pajtn.py
# data are accessible via:
#
#    sys.argv[1]
#

import json
import sys

with open(sys.argv[1]) as file:
    data = json.load(file)
    
print(data)