import mysql.connector
import subprocess

class DbConnect:

    def __init__(self):
        self.conn = None
        self.mysql_params = {'host':'localhost','user':'root','password':'','database':'bdpoa'}

    def connect(self):
        try:
            self.conn = mysql.connector.connect(**self.mysql_params)
            return self.conn
        
        except mysql.connector.Error as e:
            print('MySQL connection failed:', e)
            return None
        
        """Exporta la base de datos a un archivo .sql"""
    def exporte(self, output_file="backup_insai.sql"):
        try:
            comando = (
                f"mysqldump -h {self.mysql_params['host']} "
                f"-u {self.mysql_params['user']} "
                f"{self.mysql_params['database']} > {output_file}"
            )
            
            subprocess.run(comando, shell=True, check=True)
            return True
        
        except Exception as e:

            return False
        
        """Importa un archivo .sql a la base de datos"""
    def importe(self, input_file):
        try:
            comando = (
                f"mysql -h {self.mysql_params['host']} "
                f"-u {self.mysql_params['user']} "
                f"{self.mysql_params['database']} < {input_file}"
            )
            
            subprocess.run(comando, shell=True, check=True)
            return True
        
        except Exception as e:

            return False