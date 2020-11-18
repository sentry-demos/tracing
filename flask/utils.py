from datetime import datetime
import numpy
from pytz import timezone
import time

# lognormal(...) returns 1-10 + sleep for 3 seconds every two hours (second 2 hours)
def wait():
    time_to_sleep = numpy.random.lognormal(0.75, .6, 1)[0] if datetime.now(timezone('America/Los_Angeles')).hour >= 14 else numpy.random.lognormal(1.5, .5, 1)[0]
    time.sleep(time_to_sleep + .5)