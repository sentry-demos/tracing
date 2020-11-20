import operator


def wait(condition, hour, number):
    print("wait")
    print(condition(14, hour))


wait(operator.ge, 14, .5)