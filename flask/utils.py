from datetime import datetime
import numpy
from pytz import timezone
import time

# The hour is either '14' or '12' which allows for a nice overlap to show a high-to-low or low-to-high change
# the 'condition' is either "greater than or equal to" or "less than or equal to"
def wait(condition, hour, number):
    current_hour = datetime.now(timezone('America/Los_Angeles')).hour
    time_to_sleep = numpy.random.lognormal(0.75, .6, 1)[0] if condition(current_hour, hour)  else numpy.random.lognormal(1.5, .5, 1)[0]
    time.sleep(time_to_sleep + number)

# TODO explanation...
def wait_process_order():
    HOUR = 14
    NUMBER = .5
    time_to_sleep = numpy.random.lognormal(0.75, .6, 1)[0] if datetime.now(timezone('America/Los_Angeles')).hour >= HOUR else numpy.random.lognormal(1.5, NUMBER, 1)[0]
    time.sleep(time_to_sleep + NUMBER)

# TODO explanation
def wait_get_al_tools():
    HOUR = 12
    NUMBER = 1
    time_to_sleep = numpy.random.lognormal(0.75, .6, 1)[0] if datetime.now(timezone('America/Los_Angeles')).hour <= 12 else numpy.random.lognormal(1.5, .5, 1)[0]
    time.sleep(time_to_sleep + 1)