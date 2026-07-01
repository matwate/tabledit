from enum import Enum, auto, StrEnum
from pydantic import BaseModel
from typing import List 


class DB(BaseModel):
    
    diagnostico:  List[str] =sorted([
    "Sin Respuesta al Ping",
    "No detecta Modulos de RF/FPFH",
    "Alarmas de energia Activas",
    "Actividad de modernizacion en curso",
  ])
    pda:  List[str]  = sorted([
        
        "Actividad programada para el dia de hoy",
        "Se debe verificar condiciones locales de Energia y TX ",
        "Se debe tramitar el permiso de ingreso con el area de seguridad",
      
    ])
    avance: List[str]  = [] 
    other: List[str] =  []
    ebs: List[str] = [] 
    site_owners: List[str] = []  



class Store(StrEnum):
    DIAGNOSTICO = "diagnostico"
    PDA = "pda"
    AVANCE = "avance"
    OTHER  = "other" 
    EBS = "ebs"
    SITE_OWNERS = "site_owners"
