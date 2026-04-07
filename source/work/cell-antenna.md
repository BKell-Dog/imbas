---
layout: article.njk
title: Cell Antenna Beamformer
image: "phased-array.svg"
imageTransform: "scaleX(1) scaleY(0.9) skewX(-4deg) skewY(3deg) translateX(-10px) translateY(-230px);"
---

### Cell Antenna Beamformer

We were hired by a cell antenna company to be a design partner for a new cell system which would be deployed internationally in both Cyprus and Nigeria, two *wildly different environments* which constrained the design in unusual ways, one largely urban, the other largely rural or at least flat and wide open.

We designed the system's 4x8 *beamformer and power divider* to sit between the radio and the antenna. This component, one among many, is vital to the phased array behavior used heavily in new *5G-capable antennas*. The company needed to move faster than their team could manage, so they brought us in.

{% woodcut "phased-array.svg" "scaleX(1) scaleY(0.9) skewX(-4deg) skewY(3deg) translateX(-10px) translateY(-230px);" %}

Our design was nothing innovative: these technologies are well-established, yet they must be *highly precise*. It takes a team of experts to ensure that every aspect of the beamformer would work perfectly. We designed the beamformer with four [rat-race couplers](https://www.microwaves101.com/encyclopedias/rat-race-couplers), drew the PCB using the industry's [microstrip euqations](https://www.microwaves101.com/encyclopedias/microstrip), ordered it to be printed, and used a 16-port [vector network analyzer](https://www.tek.com/en/documents/primer/what-vector-network-analyzer-and-how-does-it-work) to *test the system* meticulously.

In the end we and the customer both approved our design for production, and to our knowledge these beamformers are *currently deployed* serving millions of users. The different environments of Cyprus and Nigeria guided our design towards building a highly flexible system yet with abundant user capacity.

## We Can Do Similar Work For You

{% include "components/contact.njk" %}