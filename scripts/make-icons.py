#!/usr/bin/env python3
"""Generate original, opaque PWA icons with only the Python standard library."""
from pathlib import Path
import struct
import zlib
ROOT=Path(__file__).resolve().parents[1]
def icon(size):
    pixels=bytearray(bytes((24,53,45))*size*size)
    def polygon(points,color):
        points=[(x*size/108,y*size/108) for x,y in points]
        for y in range(size):
            yy=y+.5;cross=[]
            for a,b in zip(points,points[1:]+points[:1]):
                if (a[1]<=yy<b[1]) or (b[1]<=yy<a[1]):
                    cross.append(a[0]+(yy-a[1])*(b[0]-a[0])/(b[1]-a[1]))
            cross.sort()
            for left,right in zip(cross[::2],cross[1::2]):
                for x in range(max(0,int(left)),min(size,int(right)+1)):
                    i=(y*size+x)*3;pixels[i:i+3]=bytes(color)
    polygon([(9,77),(54,55),(99,77),(54,100)],(139,168,107))
    polygon([(32,52),(54,63),(54,88),(32,77)],(239,210,155))
    polygon([(54,63),(78,51),(78,76),(54,88)],(190,150,95))
    polygon([(25,51),(43,28),(54,63)],(120,68,53))
    polygon([(43,28),(84,47),(54,63)],(199,116,79))
    polygon([(60,69),(69,65),(69,79),(60,83)],(24,53,45))
    polygon([(65,12),(67,12),(67,39),(65,39)],(233,190,106))
    polygon([(67,12),(88,22),(68,32)],(233,190,106))
    def chunk(kind,data):
        return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
    raw=b''.join(b'\0'+pixels[y*size*3:(y+1)*size*3] for y in range(size))
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')
for size in (192,512):
    (ROOT/'web'/f'icon-{size}.png').write_bytes(icon(size))
