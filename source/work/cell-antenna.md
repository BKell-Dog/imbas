---
layout: work.njk
title: Cell Antenna Beamformer
image: "phased-array.svg"
imageTransform: "scaleX(1) scaleY(0.9) skewX(-4deg) skewY(3deg) translateX(-10px) translateY(-230px);"
---

### Cell Antenna Beamformer

This client was a cell antenna company that had just won a contract to deploy new infrastructure abroad in Cyprus and Nigeria *serving millions of users*. Their engineers had a full workload in designing a new 64-QAM phased-array antenna, so they called in our engineers to build their *beamformer*. This antenna system would be deployed in two *wildly different environments*, one largely urban, the other largely rural, which constrained the design in unusual ways.

We designed the system's 4x8 *beamformer and power divider* which sits between the radio and the antenna. This subsystem, like many others, is vital to the phased array behavior used heavily in new *5G-capable antennas*. It takes in a phased signal, divides it into multiple output paths, applies phase delays, and feeds into the antenna element.

{% woodcut "phased-array.svg", "scaleX(1) scaleY(0.9) skewX(-4deg) skewY(3deg) translateX(-10px) translateY(-230px);" %}

These technologies are well-established: we didn't have to invent anything new yet the finished PCB had to be *highly precise*. It takes a team of experts to ensure that every aspect of the beamformer would work perfectly. We designed the beamformer with four [rat-race couplers](https://www.microwaves101.com/encyclopedias/rat-race-couplers), drew the PCB using the industry's [microstrip equations](https://www.microwaves101.com/encyclopedias/microstrip), ordered it to be printed, and used a 16-port [vector network analyzer](https://www.tek.com/en/documents/primer/what-vector-network-analyzer-and-how-does-it-work) to *test the system* meticulously.

In the end we and the client both approved our design for production, and to our knowledge these beamformers are *currently deployed* serving millions of users. The different environments of Cyprus and Nigeria guided our design towards building a highly flexible system yet with abundant user capacity.

## If You Need This Kind of Precision, Let's Talk

{% include "components/contact.njk" %}