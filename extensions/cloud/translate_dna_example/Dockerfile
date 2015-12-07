FROM biopython/biopython

RUN mv /biopython/Bio /usr/local/lib/python2.7/dist-packages/
RUN mv /biopython/BioSQL /usr/local/lib/python2.7/dist-packages/

RUN mkdir /inputs
RUN mkdir /outputs

WORKDIR /
COPY ./translate.py /translate.py
CMD ["python", "/translate.py"]
