from abc import ABC, abstractmethod



class DatabaseDriver(ABC):

    @abstractmethod
    async def connect(self): 
        """
        Connect to the databse
        """
        pass
    @abstractmethod
    async def close(self):
        """
        Close the database connection
        """
        pass
    @abstractmethod
    async def fetch(self, query:str, *params): 
        """
        Performs a query, returning many, or not at all
        """
        pass

    @abstractmethod
    async def fetchone(self, query:str,  *params): 
        """
        Performs a query, returning one, or not at all
        """
        pass
        
    @abstractmethod
    async def execute(self, query:str,  *params): 
        """
        Executes a query, that doesn't return
        """
        pass




