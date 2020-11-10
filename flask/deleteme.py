import datetime
import time
import numpy


for x in range(10):
  print(numpy.random.lognormal(0.75, .6, 1)[0])

print("\n\n--------------\n\n")

for x in range(10):
      print(numpy.random.lognormal(1.5, .5, 1)[0])
