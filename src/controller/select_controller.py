from model.select_model import SelectModel
from datetime import datetime
import random


class SelectController:

    def __init__(self):
        self.modelo = SelectModel()

    def select(self, col1, col2, tabla):
        return self.modelo.get_select(col1, col2, tabla)

    def select_where(self, col1, col2, col3, tabla, id):
        return self.modelo.get_select_where(col1, col2, col3, tabla, id)
