FROM ubuntu:14.04
RUN apt-get -y update
RUN apt-get install -y python3 python3-pip
RUN pip3 install biopython
COPY ./translate.py /translate.py
CMD ["python3", "/translate.py"]
