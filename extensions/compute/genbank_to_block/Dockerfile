FROM biopython/biopython

RUN mkdir /inputs
RUN mkdir /outputs

RUN pip3 install requests

WORKDIR /
COPY ./read_genbank.py /read_genbank.py
CMD ["python3.5", "/read_genbank.py", "inputs/genbank", "outputs/block", "outputs/sequence"]
