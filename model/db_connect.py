import mysql.connector

class DbConnect:
    def __init__(self):
        self.conn = None
        self.mysql_params = {'host':'localhost','user':'root','password':'','database':'insai_poa'}

    def connect(self):
        try:
            self.conn = mysql.connector.connect(**self.mysql_params)
            return self.conn
        
        except mysql.connector.Error as e:
            print('MySQL connection failed:', e)
            return None
        