# links = []

# f = open("search.html", "r")
# lines = f.readlines()
#
# for line in lines:
#     if line.__contains__('&format=kern'):
#         print(line)
#
#
#
# <a target="new" href="https://verovio.humdrum.org?file=users/craig/dice/stadler/gioco/measures/gioco002.krn">
#     <img alt="Verovio Humdrum Viewer" src=https://kern.humdrum.org/img/button-V.gif title="Verovio Humdrum Viewer" border=0>
# </a>&nbsp;<a href=https://kern.humdrum.org/cgi-bin/ksdata?location=users/craig/dice/stadler/gioco/measures&file=gioco002.krn&format=kern><img alt="Humdrum File" src=https://kern.humdrum.org/img/button-H.gif border=0></a>&nbsp;<a href=https://kern.humdrum.org/cgi-bin/ksdata?location=users/craig/dice/stadler/gioco/measures&file=gioco002.krn&format=midi><img alt="MIDI File" src=https://kern.humdrum.org/img/button-M.gif border=0></a>

from bs4 import BeautifulSoup
import requests


def splitAherf():
    links = []
    url = "https://kern.humdrum.org/search?type=Text"

    page = requests.get(url)
    data = page.text
    soup = BeautifulSoup(data)

    i=0

    for link_object in soup.find_all('a'):
        link = str(link_object.get('href'))+'\n'
        if link.__contains__('&format=kern'):
            links.append(link)
            i+=1
            print(i)


    file1 = open('links.txt', 'w')
    file1.writelines(links)
    file1.close()

splitAherf()
print('end')
