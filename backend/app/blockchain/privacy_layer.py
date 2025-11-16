"""
Blockchain Privacy Layer for Secure Data Storage
Lightweight implementation using Ethereum/Hyperledger principles
"""

import hashlib
import json
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class Block:
    """Represents a single block in the blockchain"""
    
    def __init__(self, index: int, data: Dict, previous_hash: str, timestamp: Optional[datetime] = None):
        self.index = index
        self.timestamp = timestamp or datetime.utcnow()
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate hash of the block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp.isoformat(),
            "data": self.data,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def to_dict(self) -> Dict:
        """Convert block to dictionary"""
        return {
            "index": self.index,
            "timestamp": self.timestamp.isoformat(),
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }


class Blockchain:
    """Lightweight blockchain for data privacy"""
    
    def __init__(self):
        self.chain: List[Block] = [self.create_genesis_block()]
        self.pending_data: List[Dict] = []
    
    def create_genesis_block(self) -> Block:
        """Create the first block in the chain"""
        return Block(0, {"message": "Genesis Block"}, "0")
    
    def get_latest_block(self) -> Block:
        """Get the most recent block"""
        return self.chain[-1]
    
    def add_data(self, user_id: str, data_type: str, encrypted_data: str, metadata: Optional[Dict] = None):
        """Add data to pending transactions"""
        data_entry = {
            "user_id": user_id,
            "data_type": data_type,  # chat_message, mood_log, etc.
            "encrypted_data": encrypted_data,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        self.pending_data.append(data_entry)
    
    def mine_block(self) -> Block:
        """Mine a new block with pending data"""
        if not self.pending_data:
            logger.warning("No pending data to mine")
            return None
        
        new_block = Block(
            index=len(self.chain),
            data={"transactions": self.pending_data.copy()},
            previous_hash=self.get_latest_block().hash
        )
        
        self.chain.append(new_block)
        self.pending_data = []
        
        logger.info(f"Mined block {new_block.index}")
        return new_block
    
    def get_user_data(self, user_id: str, data_type: Optional[str] = None) -> List[Dict]:
        """Retrieve user data from blockchain"""
        user_data = []
        
        for block in self.chain[1:]:  # Skip genesis block
            if "transactions" in block.data:
                for transaction in block.data["transactions"]:
                    if transaction["user_id"] == user_id:
                        if data_type is None or transaction["data_type"] == data_type:
                            user_data.append(transaction)
        
        return user_data
    
    def verify_chain(self) -> bool:
        """Verify the integrity of the blockchain"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Verify hash
            if current_block.hash != current_block.calculate_hash():
                logger.error(f"Block {i} hash is invalid")
                return False
            
            # Verify previous hash
            if current_block.previous_hash != previous_block.hash:
                logger.error(f"Block {i} previous hash is invalid")
                return False
        
        return True
    
    def get_chain_length(self) -> int:
        """Get the length of the blockchain"""
        return len(self.chain)
    
    def to_dict(self) -> Dict:
        """Convert blockchain to dictionary"""
        return {
            "chain": [block.to_dict() for block in self.chain],
            "pending_data_count": len(self.pending_data)
        }


class PrivacyLayer:
    """Privacy layer manager for Innovaden"""
    
    def __init__(self):
        self.blockchain = Blockchain()
        self.user_keys: Dict[str, str] = {}  # In production, use proper key management
    
    def encrypt_data(self, data: str, user_id: str) -> str:
        """Encrypt data (simplified - use proper encryption in production)"""
        # In production, use AES encryption with user-specific keys
        key = self.user_keys.get(user_id, hashlib.sha256(user_id.encode()).hexdigest())
        encrypted = hashlib.sha256((data + key).encode()).hexdigest()
        return encrypted
    
    def store_data(self, user_id: str, data_type: str, data: Dict) -> str:
        """Store encrypted data on blockchain"""
        encrypted_data = self.encrypt_data(json.dumps(data), user_id)
        
        self.blockchain.add_data(
            user_id=user_id,
            data_type=data_type,
            encrypted_data=encrypted_data,
            metadata={"original_type": type(data).__name__}
        )
        
        # Mine block every 10 transactions or on demand
        if len(self.blockchain.pending_data) >= 10:
            self.blockchain.mine_block()
        
        return encrypted_data
    
    def retrieve_data(self, user_id: str, data_type: Optional[str] = None) -> List[Dict]:
        """Retrieve user's encrypted data from blockchain"""
        return self.blockchain.get_user_data(user_id, data_type)
    
    def mine_pending(self) -> Block:
        """Mine pending transactions"""
        return self.blockchain.mine_block()
    
    def get_blockchain_status(self) -> Dict:
        """Get blockchain status"""
        return {
            "chain_length": self.blockchain.get_chain_length(),
            "pending_transactions": len(self.blockchain.pending_data),
            "is_valid": self.blockchain.verify_chain()
        }


# Global instance
privacy_layer = PrivacyLayer()

