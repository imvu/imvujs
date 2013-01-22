import sys
import os.path

from normpath import normpath

if __name__ == '__main__':
    print os.path.relpath(normpath(sys.argv[1]), normpath(sys.argv[2]))
