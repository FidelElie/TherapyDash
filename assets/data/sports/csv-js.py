import os
import csv
import json

csv_file_path = os.path.abspath("app/assets/data/sports/data.csv")
json_file_path = os.path.abspath("app/assets/data/sports/data.json")


field_names = ["Div","Date","HomeTeam","AwayTeam","FTHG","FTAG","FTR","HTHG","HTAG","HTR","HS","AS","HST","AST","HF","AF","HC","AC","HY","AY","HR","AR","B365H","B365D","B365A","BWH","BWD","BWA","IWH","IWD","IWA","LBH","LBD","LBA","PSH","PSD","PSA","WHH","WHD","WHA","VCH","VCD","VCA","Bb1X2","BbMxH","BbAvH","BbMxD","BbAvD","BbMxA","BbAvA","BbOU","BbMx>2.5","BbAv>2.5","BbMx<2.5","BbAv<2.5,BbAH","BbAHh","BbMxAHH","BbAvAHH","BbMxAHA","BbAvAHA","PSCH","PSCD","PSCA"]

with open(csv_file_path, "r") as csv_read:
    with open(json_file_path, "w") as json_write:
        reader = list(csv.DictReader( csv_read, fieldnames=field_names))
        json_write.write("[")
        for index, row in enumerate(reader):
            if (index != 0):
                json.dump(row, json_write, indent=4)

            if (index != 0 and index != len(reader) - 1):
                json_write.write(',\n')
        json_write.write("]")
