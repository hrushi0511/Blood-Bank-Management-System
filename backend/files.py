import os

class Donor:
    def __init__(self,record):
        if type(record) == str:
            record = record[:record.index('$')-1]
            self.roll_id,self.date, self.name, self.phone_no, \
            self.gender, self.blood_group, self.units = record.split('|')
            self.blood_group = self.blood_group.upper()
        elif type(record) == dict:
            self.roll_id = record['ID']
            self.name = record['Name']
            self.phone_no = record['Phone No']
            self.gender = record['Gender']
            self.blood_group = record['Blood Group']
            self.blood_group = self.blood_group.upper()
            self.units = record['Units']
            self.date = record['Date']
   
    
    def asDict(self):
        return {
            'ID' : self.roll_id,
            'Name' : self.name,
            'Phone No' : self.phone_no,
            'Gender' : self.gender,
            'Blood Group' : self.blood_group,
            'Units' : self.units,
            'Date' : self.date
        }
    

    def __str__(self):
        record = '|'.join([self.roll_id, self.date, self.name, self.phone_no, \
                            self.gender, self.blood_group, self.units, '$'])
        if len(record) < 50:
            record += ('|' * (50 - len(record)))
        return record + '\n'
    

class Seeker:
    def __init__(self,record):
        if type(record) == str:
            record = record[:record.index('$')-1]
            self.roll_id, self.date, self.name, self.phone_no, \
            self.gender, self.blood_group,self.units, self.status = record.split('|')
            self.blood_group = self.blood_group.upper()

        elif type(record) == dict:
            self.roll_id = record['ID']
            self.name = record['Name']
            self.phone_no = record['Phone No']
            self.gender = record['Gender']
            self.blood_group = record['Blood Group']
            self.blood_group = self.blood_group.upper()
            self.units = record['Units']
            self.date = record['Date']
            self.status = record['Status']
    

    def asDict(self):
        return {
            'ID' : self.roll_id,
            'Name' : self.name,
            'Phone No' : self.phone_no,
            'Gender' : self.gender,
            'Blood Group' : self.blood_group,
            'Units' : self.units,
            'Date' : self.date,
            'Status' : self.status
        }
    

    def __str__(self):
        record = '|'.join([self.roll_id, self.date, self.name, self.phone_no, \
                           self.gender, self.blood_group, self.units, self.status, '$'])
        if len(record) < 50:
            record += ('|' * (50 - len(record)))
        return record + '\n'

class Blood:
    def __init__(self,record):
        if type(record) == str:
            record = record[:record.index('$')-1]
            self.blood_group, self.units = record.split('|')
            self.blood_group = self.blood_group.upper()
    
        elif type(record) == dict:
            self.blood_group = record['Blood Group']
            self.blood_group = self.blood_group.upper()
            self.units = record['Units']

    def asDict(self):
        return {
            'Blood Group' : self.blood_group,
            'Units' : self.units
        }
    

    def __str__(self):
        record = '|'.join([self.blood_group, self.units, '$'])
        if len(record) < 50:
            record += ('|' * (50 - len(record)))
        return record + '\n'

class Report:
    def __init__(self,record):
        if type(record) == str:
            record = record[:record.index('$')-1]
            self.seeker_id, self.price, *self.donor_id= record.split('|')
            temp = []
            for i in range(0,len(self.donor_id),2):
                temp.append([self.donor_id[i], self.donor_id[i+1]])
            self.donor_id = temp
        elif type(record) == dict:
            self.seeker_id = record['Seeker ID']
            self.donor_id = record['Donor ID']
            self.price = record['Price']
    

    def asDict(self):
        return {
            'Seeker ID' : self.seeker_id,
            'Donor ID' : self.donor_id,
            'Price' : self.price
        } 
    
    def __str__(self):
        temp = []
        for x in self.donor_id:
            temp += x
        record = '|'.join([self.seeker_id, self.price, *temp, '$'])
        if len(record) < 50:
            record += ('|' * (50 - len(record)))
        return record + '\n'

class BloodDonor:
    file_name = 'backend/DataFiles/BloodDonor.txt'

    def __init__(self):
        if not os.path.isfile(self.file_name):
                file = open(self.file_name, 'x')
                file.close()

    def writeDataDonor(self,data):
        try:
            new_donor = Donor(data)
            file = open(self.file_name, 'a')
            record = str(new_donor)
            file.write(record)
            file.close()
            return 1
        except Exception as e:
            print(e)
            return -1

    def readDataDonor(self):
        try:
            file = open(self.file_name, 'r')
            donors = [Donor(record) for record in file.readlines()]
            file.close()
            return donors 
        except Exception as e:
            print(e)
            return -1

    

    def searchDonor(self,roll_id):
        try:
            file = open(self.file_name, 'r')
            for donor in file.readlines():
                if roll_id == donor.split('|')[0]:
                    return Donor(donor)
            return -1
        except Exception as e:
            print(e)
            return -1
        
    def modifyDonor(self, roll_id,data):
        try:
            new_donor = Donor(data)
            file = open(self.file_name, 'r')
            donors = [Donor(record) for record in file.readlines()]
            file.close()
            file = open(self.file_name, 'w+')
            val = -1
            for donor in donors:
                if donor.roll_id == roll_id:
                    file.write(str(new_donor))
                    val = 1
                else:
                    file.write(str(donor))
            file.close()
            return val
        except:
            return -1

class BloodSeeker:
    file_name = 'backend/DataFiles/BloodSeeker.txt'

    def __init__(self):
         if not os.path.isfile(self.file_name):
                file = open(self.file_name, 'x')
                file.close()


    def writeDataSeeker(self,data):
        try:
            new_seeker = Seeker(data)
            file = open(self.file_name, 'a')
            record = str(new_seeker)
            file.write(record)
            file.close()
            return 1
        except:
            return -1
        
    def readDataSeeker(self):
        try:
            file = open(self.file_name, 'r')
            seekers = [Seeker(record) for record in file.readlines()]
            file.close()
            return seekers
        except Exception as e:
            print(e)
            return -1
        
    def searchSeeker(self,roll_id):
        try:
            file = open(self.file_name, 'r')
            for seeker in file.readlines():
                if roll_id == seeker.split('|')[0]:
                    return Seeker(seeker)
            return -1
        except:
            return -1
        
    def modifySeeker(self, roll_id,data):
        try:
            new_seeker = Seeker(data)
            file = open(self.file_name, 'r')
            seekers = [Seeker(record) for record in file.readlines()]
            file.close()
            file = open(self.file_name, 'w+')
            val = -1
            for seeker in seekers:
                if seeker.roll_id == roll_id:
                    file.write(str(new_seeker))
                    val = 1
                else:
                    file.write(str(seeker))
            file.close()
            return val
        except:
            return -1
    
class BloodInventory:
    file_name = 'backend/DataFiles/BloodInventory.txt'
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

    def __init__(self):
        try:
            if not os.path.isfile(self.file_name):
                file = open(self.file_name, 'w')
                data = [str(Blood({
                    'Blood Group' : blood,
                    'Units' : '0' 
                })) for blood in self.blood_groups]

                file.writelines(data)
                file.close()
        except Exception as e:
            print(e)

    def readDataInventory(self):
        try:
            self.__init__()
            file = open(self.file_name, 'r')
            records = [Blood(record) for record in file.readlines()]
            file.close()
            return records
        except Exception as e:
            print(e)
            return -1


    def searchDataInventory(self, blood_group):
        try:
            self.__init__()
            file = open(self.file_name, 'r')
            for record in file.readlines():
                record = Blood(record)
                if record.blood_group == blood_group.upper():
                    return record
            return -1
        except:
            return -1
        
    
    def modifyDataInventory(self,data):
        try:
            self.__init__()
            new_record = Blood(data)
            file = open(self.file_name, 'r')
            records = [Blood(record) for record in file.readlines()]
            file.close()
            file = open(self.file_name, 'w+')
            val = -1
            for record in records:
                if record.blood_group == new_record.blood_group:
                    record.units = new_record.units
                    val = 1
                file.write(str(record))
            file.close()
            return val
        except Exception as e:
            print(e)
            return -1         
        
class BloodReports:
    file_name = 'backend/DataFiles/BloodReports.txt'

    def __init__(self):
        if not os.path.isfile(self.file_name):
            file = open(self.file_name, 'w')
            file.close()

    def readBloodReports(self):
        try:
            file = open(self.file_name, 'r')
            reports = [Report(record) for record in file.readlines()]
            return reports
        except Exception as e:
            print(e)
            return -1

    def writeBloodReport(self, record):
        try:
            file = open(self.file_name, 'a')
            new_record = Report(record)
            file.write(str(new_record))
            file.close()
            return 1
        except Exception as e:
            print(e)
            return -1
        
    def searchBloodReport(self, reportId):
        try:
            file = open(self.file_name, 'r')
            for record in file.readlines():
                report = Report(record)
                if report.seeker_id == reportId:
                    file.close()
                    return report
            return -1
        except Exception as e:
            print(e)
            return -1