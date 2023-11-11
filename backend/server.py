from files import *
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from collections import defaultdict

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})


donorsObj  = BloodDonor()
seekerObj = BloodSeeker()
inventoryObj = BloodInventory()
reportObj = BloodReports()

@app.route('/getdonors', methods = ['GET'])
def getdonors():
    try:
        donors = donorsObj.readDataDonor()
        if donors == -1:
            return jsonify({}), 500
        elif donors == []:
            return jsonify([]), 204
        else:
            return jsonify([donor.asDict() for donor in donors]), 200 
    except:
        return jsonify({}), 500
    

@app.route('/getseekers', methods = ['GET'])
def getseekers():
    try:
        seekers = seekerObj.readDataSeeker()
        if seekers == -1:
            return jsonify({}), 500
        elif seekers == []:
            return jsonify([]), 204
        else:
            return jsonify([seeker.asDict() for seeker in seekers]), 200 
    except:
        return jsonify({}), 500


@app.route('/getinventory', methods = ['GET'])
def getinventory():
    try:
        status = inventoryObj.readDataInventory()
        if status == -1:
            return jsonify({}), 500
        else:
            return jsonify([blood.asDict() for blood in status]), 200
    except:
        return jsonify({}), 500

@app.route('/writedonor', methods = ['POST'])
def writedonor():
    try:
        data = request.get_json()
        status = donorsObj.writeDataDonor(data)
        if status == -1:
            return jsonify(data), 500
        inventory_blood_data = inventoryObj.searchDataInventory(data['Blood Group'])
        if inventory_blood_data == -1:
            return jsonify(data), 500
        new_record = {'Blood Group' : data['Blood Group']}
        new_record['Units'] = str(int(inventory_blood_data.units) + int(data['Units']))
        inventory_update_status = inventoryObj.modifyDataInventory(new_record)
        if inventory_update_status == -1:
            return jsonify(data), 500
        
        return jsonify(data), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500


@app.route('/writeseeker', methods = ['POST'])
def writeseeker():
    try:
        data = request.get_json()
        status = seekerObj.writeDataSeeker(data)
        if status == -1:
            return jsonify(data), 500
        return jsonify(data), 200
    except:
        return jsonify({}), 500


@app.route('/modifydonor', methods=['POST'])
def modifyDonor():
    try:
        data = request.get_json()
        old_record = data['old']
        new_record = data['new']
        modificationStatus = donorsObj.modifyDonor(old_record['ID'], new_record)
        if modificationStatus == -1:
            return jsonify({}), 500
        
        if old_record['Blood Group'] != new_record['Blood Group'] or old_record['Units'] != new_record['Units']:
            old_blood = inventoryObj.searchDataInventory(old_record['Blood Group'])
            new_blood = inventoryObj.searchDataInventory(new_record['Blood Group'])
            if old_blood == -1 or new_blood == -1:
                return jsonify(data), 500
            old_blood.units = str(int(old_blood.units) - int(old_record['Units']))
            new_blood.units = str(int(new_blood.units) - int(new_record['Units'])) 
            update_inventory = inventoryObj.modifyDataInventory(old_blood.asDict())
            if update_inventory == -1:
                return jsonify(data), 500
            update_inventory = inventoryObj.modifyDataInventory(new_blood.asDict())
            if update_inventory == -1:
                return jsonify(data), 500
        return jsonify(data), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500

@app.route('/modifyseeker', methods=['POST'])
def modifySeeker():
    try:
        data = request.get_json()
        old_record = data['old']
        new_record = data['new']
        modificationStatus = seekerObj.modifySeeker(old_record['ID'], new_record)
        if modificationStatus == -1:
            return jsonify({}), 500
        return jsonify(data), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500
    
@app.route('/makereport', methods=['POST'])
def writeReport():
    try:
        data = request.get_json()
        units_required = int(data['Units'])
        selected_donors = []
        all_donors = donorsObj.readDataDonor()
        all_reports = reportObj.readBloodReports()
        if all_donors == -1 or all_reports == -1:
            return jsonify({}), 500
        all_donors.sort(key= lambda x:datetime.strptime(x.date,'%Y-%m-%d'))
        donor_units_count = defaultdict(int)
        for report in all_reports:
            for donor in report.donor_id:
                donor_units_count[donor[0]] += int(donor[1])
        for donor in all_donors:
            if donor.blood_group == data['Blood Group'] and donor.units != str(donor_units_count[donor.roll_id]):
                available_units = int(donor.units) - int(donor_units_count[donor.roll_id])
                if available_units >= units_required:
                    selected_donors.append([donor.roll_id, str(units_required)])
                    break
                else:
                    selected_donors.append([donor.roll_id, str(available_units)])
                    units_required -= available_units

        report_data = {
            'Seeker ID' : data['ID'],
            'Donor ID' : selected_donors,
            'Price' : data['Price']
        } 
        report_status = reportObj.writeBloodReport(report_data)
        if report_status == -1:
            return jsonify({}), 500
        blood_details = inventoryObj.searchDataInventory(data['Blood Group'])
        if blood_details == -1:
            return jsonify({}), 500
        blood_details.units = str(int(blood_details.units) - int(data['Units']))
        update_status = inventoryObj.modifyDataInventory(blood_details.asDict())
        if update_status == -1:
            return jsonify({}), 500
        return jsonify(report_data), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500
    
@app.route('/getreport', methods=['POST'])
def generateReport():
    try:
        data = request.get_json()
        report = reportObj.searchBloodReport(data['ID'])
        if report != -1:
            return jsonify(report.asDict()), 200
        return jsonify({}),500
    except Exception as e:
        print(e)
        return jsonify({}), 500

@app.route('/searchdonor', methods=['POST'])
def searchDonor():
    try:
        donor_id = request.get_json()['ID']
        donor = donorsObj.searchDonor(donor_id)
        if donor == -1:
            return jsonify({}), 200
        return jsonify(donor.asDict()), 200
    except Exception as e:
        return jsonify({}), 500

@app.route('/searchseeker', methods=['POST'])
def searchSeeker():
    try:
        seeker_id = request.get_json()['ID']
        seeker = seekerObj.searchSeeker(seeker_id)
        if seeker == -1:
            return jsonify({}), 200
        return jsonify(seeker.asDict()), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500
    
@app.route('/searchinventory', methods = ['POST'])
def searchInventory():
    try:
        blood_group = request.get_json()['Blood Group']
        blood_details = inventoryObj.searchDataInventory(blood_group)
        if blood_details == -1:
            return jsonify({}), 500
        return jsonify(blood_details.asDict()), 200
    except Exception as e:
        print(e)
        return jsonify({}), 500

if __name__ == '__main__':
    app.run(debug = True, port = 8000)
