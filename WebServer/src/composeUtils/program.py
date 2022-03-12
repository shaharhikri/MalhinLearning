import sys
import os

def main():
    print('program.py: start')
    if len(sys.argv)<2:
        print('program.py: ERROR - There\'s no arg.')
        return
    
    args = sys.argv[1].split(' ')

    print('program.py: '+args[0])
    try:
        input_file = open(args[0])
    except:
        print('program.py: ERROR - File doesn\'t exist.')
        return
    
    text = input_file.read() + '\nThis text was added by program.py!'
    input_file.close()
    print(text)
    sys.stdout = open(args[1]+'\output.txt', 'w', encoding="utf-8")
    print(text)
    sys.stdout.close()


if __name__ == '__main__':
   main()
