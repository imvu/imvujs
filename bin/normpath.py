import os.path
import re
import sys

def normpath(path):
    return os.path.normpath(re.sub('.*//', '/', path))

if __name__ == '__main__':
    print normpath(sys.argv[1])
